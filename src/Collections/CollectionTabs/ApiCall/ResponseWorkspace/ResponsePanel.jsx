import { useRecoilValue } from 'recoil';
import { responseInfo } from '../../../CollectionsAtom';
import ResponseTabs from './ResponseTabs';

export default function Response({ loading }) {
    const response = useRecoilValue(responseInfo);
    let doc = '{}';
    if (response && response.data !== undefined) {
        doc = JSON.stringify(response.data, null, 2);
    }

    return (
        <div className="my-4">
            <ResponseTabs doc={doc} response={response} loading={loading} />
        </div>
    );
}
