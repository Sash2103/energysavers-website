import Shell from '@/components/site/Shell';
import Hero from '@/components/home/Hero';
import Proof from '@/components/home/Proof';
import ActiveHarmonicFilter from '@/components/home/ActiveHarmonicFilter';
import HeatPump from '@/components/home/HeatPump';
import Products from '@/components/home/Products';
import Offer from '@/components/home/Offer';
import Sectors from '@/components/home/Sectors';
import About from '@/components/home/About';
import Insights from '@/components/home/Insights';
import ProductSheet from '@/components/home/ProductSheet';
import CaseSheet from '@/components/home/CaseSheet';
import CertViewer from '@/components/shared/CertViewer';

export const metadata = {
  title: 'Energy Savers — Power Quality and Energy Efficiency Solutions, Dubai',
  description: 'Energy Savers is a UAE based engineering company focusing on implementing Power Quality/HVAC/SCADA solutions to industrial and commercial clients.',
};

// Sections alternate ink and paper on purpose: hero, proof, AHF, heat pump, bench, offer, sectors,
// About, insights, contact.
export default function Home() {
  return (
    <Shell home extra={<><ProductSheet /><CaseSheet /><CertViewer /></>}>
      <Hero />
      <Proof />
      <ActiveHarmonicFilter />
      <HeatPump />
      <Products />
      <Offer />
      <Sectors />
      <About />
      <Insights />
    </Shell>
  );
}
