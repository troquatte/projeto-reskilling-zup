'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// Context
import { useAuth } from '@/shared/core/hooks/useAuth';

// Components
import { Banner } from '@/shared/components/Banner/Banner';

// Styles
import styles from './profile.module.scss';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function UserProfile() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setValue('name', user.name || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
    setSuccessMsg('Perfil atualizado com sucesso!');

    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="container" role="main" aria-label="Editar Perfil do Usuário">
      <Banner />

      <div className={styles.profileContainer}>
        <header>
          <Image src={user.avatar} alt="Seu Avatar de Perfil" width={100} height={100} />
          <div>
            <h1>Meu Perfil</h1>
            <p>Gerencie suas informações pessoais</p>
            <Link href="/" className="btn btn--primary">
              Voltar para a página inicial
            </Link>
          </div>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {successMsg && (
            <div className="alert alert--success" role="alert" aria-live="polite">
              {successMsg}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              {...register('name')}
              className={errors.name ? 'error' : ''}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <span className="error-message" role="alert">
                {String(errors.name.message)}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              disabled
              placeholder="Ex: cliente@itau.com.br"
              {...register('email')}
              title="O e-mail não pode ser alterado"
            />
          </div>

          <button type="submit" className="btn btn--primary" disabled={!isValid}>
            Salvar Alterações
          </button>
        </form>
      </div>
    </main>
  );
}
