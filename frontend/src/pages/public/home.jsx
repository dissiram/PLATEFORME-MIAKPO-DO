import  Hero  from '../../components/Hero';
import  SearchForm  from '../../components/SearchForm';
import  JobCategories  from '../../components/JobCategories';
import Choisir  from '../../components/Choisir';

export default function Home() {
  return (
    <div className="overflow-hidden">
      <main>
        <Hero />
        <SearchForm />
        <Choisir />
        <JobCategories />
      </main>
    </div>
  )
}
