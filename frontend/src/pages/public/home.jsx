import  Hero  from '../../components/Hero';
import  SearchForm  from '../../components/SearchForm';
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
        <SearchForm />
        <Choisir />
        <JobCategories />
        <Footer/>
      </main> 
    </div>
  )
}
