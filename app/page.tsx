import AlphaBetHomepage from '@/components/public/homepage';
import SEOHead from '@/components/seo/SEOHead';

export default function Home() {
  return (
    <>
      <SEOHead
        title="Alpha-Bet - Entrepreneurship Program for Combat Veterans"
        description="Join Alpha-Bet: Free 10-week entrepreneurship program for US & Israeli combat veterans. Learn startup fundamentals, build your network, and transform military leadership into business success."
        keywords={[
          'entrepreneurship program',
          'combat veteran startup training',
          'military entrepreneur program',
          'veteran business accelerator',
          'startup program for veterans',
          'military to civilian transition',
          'veteran entrepreneur training',
          'business development veterans',
          'startup accelerator military',
          'veteran startup incubator'
        ]}
        canonical="/"
      />
      <AlphaBetHomepage />
    </>
  );
}
