'use client';

// Components
import { Banner } from '@/shared/components/Banner/Banner';

// Hooks
import { useAuth } from '@/shared/core/hooks/useAuth';

// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório').email('Endereço de e-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Styles
import { useState } from 'react';
import styles from './login.module.scss';

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRHForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    const success = login(data);
    setIsAuthenticated(success);

    if (!success) {
      setErrorMsg('E-mail ou senha inválidos');
    } else {
      setErrorMsg('');
    }
  };

  return (
    <main className="container" role="main" aria-label="Página de Login">
      <Banner />

      <div className={styles.loginContainer}>
        <h2>Acesse sua conta</h2>
        <p>Faça login para gerenciar seu perfil e compras.</p>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm} noValidate>
          {errorMsg.length > 0 && (
            <div className="alert alert--error" role="alert" aria-live="polite">
              {errorMsg}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="E-mail ex: cliente@itau.com.br"
              {...register('email')}
              className={errors.email ? 'error' : ''}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <span className="error-message" role="alert">
                {String(errors.email.message)}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              placeholder="Senha ex: 123456"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && (
              <span className="error-message" role="alert">
                {String(errors.password.message)}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn--primary btn--block">
            Entrar na minha conta
          </button>
        </form>
      </div>
    </main>
  );
}
