// import { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import ProductCard from '../components/ProductCard'; // Assume you have this component

// const SearchResults = () => {
//     const location = useLocation();
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const fetchResults = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/api/products/search`, {
//                     params: {
//                         term: searchParams.get('term'),
//                         category: searchParams.get('category'),
//                         location: searchParams.get('location')
//                     }
//                 });
//                 setResults(response.data);
//             } catch (error) {
//                 console.error('Search error:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResults();
//     }, [location.search]);

//     return (
//         <div className="max-w-7xl mx-auto p-4">
//             <h1 className="text-3xl font-bold text-[#009688] mb-8">Search Results</h1>
//             // Added proper loading states and error handling
//             {loading ? (
//                 <div className="flex justify-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009688]"></div>
//                 </div>
//             ) : results.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     {results.map(product => (
//                         <ProductCard key={product._id} product={product} />
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-12">
//                     <div className="text-2xl text-gray-500 mb-4">No products found</div>
//                     <p className="text-gray-600">
//                         Try adjusting your search filters or browse our
//                         <Link to="/" className="text-[#009688] ml-1 hover:underline">
//                             active listings
//                         </Link>
//                     </p>
//                 </div>
//             )}
//         </div>
//     );


// };

// export default SearchResults;


import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const term = searchParams.get('term') || '';
    setSearchQuery(term);
    
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/search`, {
          params: {
            term,
            category: searchParams.get('category'),
            location: searchParams.get('location')
          }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-screen py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        {searchQuery && (
          <p className="text-lg text-gray-600">
            {results.length > 0 
              ? `Found ${results.length} item${results.length !== 1 ? 's' : ''} for "` 
              : 'No results for "'
            }
            <span className="font-semibold text-[#009688]">{searchQuery}</span>"
          </p>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009688]"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl py-16 px-4 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 max-w-md">
            We couldn't find any products matching your search criteria. Try different keywords or filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;