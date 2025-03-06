import TestOpenMap from './TestOpenMap';
import TestSearchLocation from './TestSearchLocation';
import TestSelectLocation from './TestSelectLocation';
import TestLocationLayout from './TestLocationLayout';

const TestLocation = () => {
  return (
    <div className="h-full w-full">
      <TestLocationLayout
        childrenTop={<TestSearchLocation />}
        childrenCenter={<TestOpenMap />}
        childrenBottom={<TestSelectLocation showEndLocation={true} showMyLocation={true} />}
      ></TestLocationLayout>
    </div>
  );
};

export default TestLocation;
