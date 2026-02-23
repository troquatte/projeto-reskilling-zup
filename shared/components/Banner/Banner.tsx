'use client';

import Image from 'next/image';
import Link from 'next/link';

// Styles
import styles from './banner.module.scss';

// Hooks
import { useAuth } from '@/shared/core/hooks/useAuth';

export const Banner = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header
      className={styles.hostBannerComponent}
      role="banner"
      aria-label="Cabeçalho da loja Itaú Store"
    >
      <div className={styles.logoContainer}>
        <Image
          src="/assets/itau-logo.webp"
          alt="Logotipo Institucional do Itaú Store"
          width={100}
          height={100}
          priority
        />
        <div>
          <h1>Itaú Store</h1>
          <p>Encontre os melhores produtos com a nossa curadoria!</p>
        </div>
      </div>

      <div className={styles.authContainer}>
        {isAuthenticated && user ? (
          <div className={styles.userMenu}>
            <Link href="/user-profile" aria-label="Acessar Perfil do Usuário">
              <Image src={user.avatar} alt="Seu Avatar" width={40} height={40} />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
            <button onClick={logout} aria-label="Sair da conta" className="btn btn--outline">
              Sair
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn--outline" aria-label="Fazer Login">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
};
