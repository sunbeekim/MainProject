import { useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchInput from '../../forms/input/SearchInput';
import { setEndLocation } from '../../../store/slices/mapSlice';
import BaseButton from '../../common/BaseButton';
import { axiosInstance } from '../../../services/api/axiosInstance';

interface SearchResult {
  address_name: string;
  road_address_name: string;
  place_name: string;
  category_name: string;
  phone: string;
  x: string; // 경도
  y: string; // 위도
}

interface KakaoApiResponse {
  documents: SearchResult[];
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
}

const SearchLocation = () => {
  const dispatch = useDispatch();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const searchAddress = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await axiosInstance.get<KakaoApiResponse>(
        `assist/location/search?query=${query}`
      );

      if (response.data.documents.length === 0) {
        alert('검색 결과가 없습니다. 다른 주소로 검색해보세요.');
        return;
      }
      console.log('response.data.documents', response.data.documents);

      setResults(response.data.documents);
    } catch (error) {
      console.error('주소 검색 실패:', error);
      alert('주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    dispatch(
      setEndLocation({
        id: '',
        name: '',
        lat: parseFloat(result.y),
        lng: parseFloat(result.x),
        address: result.road_address_name + ' ' + result.place_name || result.address_name
      })
    );
    setResults([]);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full p-4">
      <div className="flex items-center">
        <div className="flex-[1] "></div>
        <div className="flex-[9] ">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="장소명, 도로명, 지번 주소로 검색"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchAddress(searchQuery);
              }
            }}
          />
        </div>
        <div className="ml-3 "></div>
        <BaseButton
          onClick={() => searchAddress(searchQuery)}
          variant="primary"
          className="px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? '검색 중...' : '검색'}
        </BaseButton>
        <div className="flex-[1] "></div>
      </div>

      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((result, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
              onClick={() => handleSelectLocation(result)}
            >
              {/* 장소명 */}
              <div className="text-sm font-medium text-gray-900">{result.place_name}</div>

              {/* 카테고리 */}
              <div className="text-xs text-gray-500 mt-0.5">
                {result.category_name.split(' > ').pop()}
              </div>

              {/* 도로명 주소 */}
              {result.road_address_name && (
                <div className="text-xs text-gray-600 mt-1">
                  <span className="text-primary">[도로명]</span> {result.road_address_name}
                </div>
              )}

              {/* 지번 주소 */}
              <div className="text-xs text-gray-600">
                <span className="text-primary">[지번]</span> {result.address_name}
              </div>

              {/* 전화번호가 있는 경우에만 표시 */}
              {result.phone && (
                <div className="text-xs text-gray-600 mt-0.5">
                  <span className="text-primary">☎</span> {result.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchLocation;
