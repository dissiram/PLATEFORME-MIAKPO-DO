import  Hero  from '../../components/Hero';
import  JobCategories  from '../../components/JobCategories';
import Choisir  from '../../components/Choisir';
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <main>
        <Navbar/>
        <Hero />
        <Choisir />
        <JobCategories />
        <Footer/>
      </main> 
    </div>
  )
}
