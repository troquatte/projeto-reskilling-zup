import styles from './AppFooter.module.scss';

export const AppFooter = () => {
  return (
    <footer className={styles.hostFooterComponent} role="contentinfo" aria-label="Rodapé do site">
      <p>Itaú Store - Todos os direitos reservados</p>
    </footer>
  );
};
