import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Simulador Exame CFC 2026.1 | Prova Objetiva Oficial FGV Tipo 4',
  description: 'Simulador interativo completo para o Exame de Suficiência do Conselho Federal de Contabilidade (CFC) Edital 01/2026, com 50 questões resolvidas e comentadas, cartão-resposta e cronômetro de 4 horas.',
  openGraph: {
    title: 'Simulador Exame CFC 2026.1 | Prova Objetiva Oficial FGV Tipo 4',
    description: 'Prepare-se para a prova do CFC com o simulador oficial da prova Tipo 4 da FGV. 50 questões com resolução comentada, gabarito e diagnóstico de aprovação.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador Exame CFC 2026.1 | Prova Objetiva Oficial FGV Tipo 4',
    description: 'Prepare-se para o Exame de Suficiência do CFC 2026.1 com gabarito oficial comentado e modo prova real.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
