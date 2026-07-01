import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@src/lib/utils';
import Button from '@shared/components/ui/button';
import { PageHeader } from '@shared/components';
import type { UserProfile, UpdateProfileDto } from '../types';
import { compressImage } from '@src/lib/image';

interface EditProfileViewProps {
  profile: UserProfile | null;
  onSave: (data: UpdateProfileDto) => Promise<UserProfile | null>;
  isSaving: boolean;
  onBack: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formata número de telefone no padrão (XX) XXXXX-XXXX
 */
const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

const validateName = (nameValue: string): string | undefined => {
  const trimmed = nameValue.trim();
  if (!trimmed) {
    return 'O nome completo é obrigatório.';
  }
  if (trimmed.length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres.';
  }
  if (trimmed.length > 255) {
    return 'O nome deve ter no máximo 255 caracteres.';
  }
  return undefined;
};

const validateEmail = (emailValue: string): string | undefined => {
  const trimmed = emailValue.trim();
  if (!trimmed) {
    return 'O e-mail é obrigatório.';
  }
  if (trimmed.length > 255) {
    return 'O e-mail deve ter no máximo 255 caracteres.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Insira um e-mail válido (exemplo@dominio.com).';
  }
  return undefined;
};

const validatePhone = (phoneValue: string): string | undefined => {
  const trimmed = phoneValue.trim();
  if (!trimmed) {
    return undefined;
  }
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 11) {
    return 'O telefone deve conter o DDD e 8 ou 9 dígitos.';
  }
  return undefined;
};

export const EditProfileView: React.FC<EditProfileViewProps> = ({
  profile,
  onSave,
  isSaving,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  // Estados de erro de validação
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializa os campos com os dados atuais do perfil
  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setName(profile.name || '');
        setEmail(profile.email || '');
        setPhone(profile.phone ? formatPhoneNumber(profile.phone) : '');
        setAvatarUrl(profile.avatarUrl || '');
        setSelectedFile(null);
        setIsCompressing(false);
        setErrors({});
      });
    }
  }, [profile]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    setPhone(formatted);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const isNotImage = !file.type.startsWith('image/');
    if (isNotImage) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, etc).');
      return;
    }

    setIsCompressing(true);
    try {
      const compressedFile = await compressImage(file, 16 * 1024 * 1024);
      setSelectedFile(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      alert('Ocorreu um erro ao processar a imagem.');
    } finally {
      setIsCompressing(false);
    }
  };

  const validate = (): boolean => {
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);

    const newErrors: typeof errors = {};
    if (nameError) {
      newErrors.name = nameError;
    }
    if (emailError) {
      newErrors.email = emailError;
    }
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || isSaving) return;

    const result = await onSave({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      avatarFile: selectedFile || undefined,
    });

    if (result) {
      onBack();
    }
  };

  return (
    <div className="w-full flex-1 max-w-[600px] mx-auto pb-4">
      <PageHeader title="Editar Perfil" onBack={onBack} />

      <form onSubmit={handleSubmit} className="space-y-6 text-left pb-24">
        {/* Seção da Imagem de Perfil */}
        <div className="flex flex-col items-center space-y-3 py-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            {/* Anel de gradiente decorativo */}
            <div className="w-32 h-32 rounded-full p-[3px] bg-gradient-to-tr from-primary to-blue-500 shadow-md group-hover:shadow-lg transition-all duration-300">
              <div className="w-full h-full rounded-full border-[3px] border-background overflow-hidden relative bg-surface-container">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview do avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px]">person</span>
                  </div>
                )}
                {/* Overlay de Hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                </div>
              </div>
            </div>

            {/* Botão Flutuante (Mobile Indicator) */}
            <div className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 shadow-md flex items-center justify-center border-2 border-background hover:scale-105 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="text-center">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="text-label-lg font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Alterar foto de perfil
            </button>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {isCompressing ? 'Processando imagem...' : 'Suporta arquivos grandes (comprimidos no envio)'}
            </p>
          </div>
        </div>

        {/* Campos do Formulário */}
        <div className="space-y-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm">
          {/* Campo Nome */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-name" className="text-label-lg font-semibold text-on-surface">
              Nome Completo
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                errors.name ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
              )}
              placeholder="Seu nome completo"
              maxLength={255}
              disabled={isSaving}
            />
            {errors.name && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.name}
              </span>
            )}
          </div>

          {/* Campo E-mail */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-email" className="text-label-lg font-semibold text-on-surface">
              E-mail
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                errors.email ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
              )}
              placeholder="seu.email@exemplo.com"
              maxLength={255}
              disabled={isSaving}
            />
            {errors.email && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.email}
              </span>
            )}
          </div>

          {/* Campo Telefone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-phone" className="text-label-lg font-semibold text-on-surface">
              Telefone (Opcional)
            </label>
            <input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                errors.phone ? "border-error focus:ring-error/20 focus:border-error" : "border-outline-variant"
              )}
              placeholder="(11) 99999-9999"
              maxLength={15}
              disabled={isSaving}
            />
            {errors.phone && (
              <span className="text-body-sm text-error flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.phone}
              </span>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1 py-3"
            disabled={isSaving || isCompressing}
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <Button
            type="button"
            onClick={onBack}
            variant="secondary"
            className="flex-1 py-3"
            disabled={isSaving || isCompressing}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileView;
