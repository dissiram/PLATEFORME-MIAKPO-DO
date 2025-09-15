import  Hero  from '../../components/Hero';
import  JobCategories  from '../../components/JobCategories';
import Choisir  from '../../components/Choisir';
import JoinUs from '../../components/JoinUs';
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Partners from '../../components/Partners';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <main>
        <Navbar/>
        <Hero />
        <Choisir />
        <JobCategories />
        <JoinUs />
        <Partners />
        <Footer/>
      </main> 
    </div>
  )
}
