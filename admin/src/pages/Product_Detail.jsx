import { useSelector } from 'react-redux';
import {
  FiCalendar,
  FiDollarSign,
  FiShoppingBag,
  FiTag,
  FiMapPin,
  FiUser,
} from 'react-icons/fi';

const Product = () => {
  const single_product = useSelector((state) => state.products.single_product);

  if (!single_product) {
    return <div className="p-8 text-center text-gray-500">No product selected</div>;
  }

  const {
    name,
    brand,
    description,
    category,
    country,
    city,
    quantity,
    startingPrice,
    bidIncrease,
    bidQuantity,
    startDate,
    endDate,
    images,
    mainImageIndex,
    user,
    status,
  } = single_product;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-20 pt-[80px]">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <img
              src={images?.[mainImageIndex] || '/placeholder.jpg'}
              alt={name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-green-500 text-white text-sm px-3 py-1 rounded-full capitalize">
              {status}
            </span>
          </div>

          <div className="p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{name}</h2>
              <p className="text-sm text-gray-500 mb-4">{description}</p>

              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex items-center">
                  <FiTag className="mr-2" /> <strong>Brand:</strong> {brand}
                </p>
                <p className="flex items-center">
                  <FiShoppingBag className="mr-2" /> <strong>Category:</strong> {category}
                </p>
                <p className="flex items-center">
                  <FiMapPin className="mr-2" /> <strong>Location:</strong> {city}, {country}
                </p>
                <p className="flex items-center">
                  <FiUser className="mr-2" /> <strong>Seller:</strong> {user?.name} ({user?.email})
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <div>
                <p>
                  <FiDollarSign className="inline mr-1" /> <strong>Starting Price:</strong> ${startingPrice}
                </p>
                <p>
                  <strong>Bid Increase:</strong> ${bidIncrease}
                </p>
                <p>
                  <strong>Bid Quantity:</strong> {bidQuantity}
                </p>
              </div>
              <div>
                <p>
                  <FiCalendar className="inline mr-1" /> <strong>Start:</strong>{' '}
                  {new Date(startDate).toLocaleString()}
                </p>
                <p>
                  <FiCalendar className="inline mr-1" /> <strong>End:</strong>{' '}
                  {new Date(endDate).toLocaleString()}
                </p>
                <p>
                  <strong>Quantity Available:</strong> {quantity}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
