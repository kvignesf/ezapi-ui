import { useRecoilValue } from 'recoil';
import { responseInfo } from '../../../CollectionsAtom';
import ResponseTabs from './ResponseTabs';

export default function Response({ loading }) {
    const response = useRecoilValue(responseInfo);
    return (
        <div className="my-4">
            <ResponseTabs doc={response.data} response={response} loading={loading} />
        </div>
    );
}
