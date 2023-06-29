import MonacoEditor from '@monaco-editor/react';
import { useRecoilState } from 'recoil';
import { requestParams } from '../../../CollectionsAtom';

export default function ReqBodyEditor() {
    const [req, setBody] = useRecoilState(requestParams);

    const handleChange = (value, event) => {
        setBody((prevData) => ({
            ...prevData,
            body: value,
        }));
    };

    return (
        <div className="m-4 h-full mb-16">
            <div className="  flex flex-col" style={{ height: `calc(100% - 80px)` }}>
                <MonacoEditor
                    height="90vh"
                    language="json"
                    value={
                        req.body && Object.keys(req.body).length > 0
                            ? JSON.parse(JSON.stringify(req.body, null, 2))
                            : '{}'
                    }
                    options={{
                        contextmenu: false,
                        minimap: {
                            enabled: false,
                        },
                        renderWhitespace: 'all',
                        wordWrap: 'on',
                        wordWrapColumn: 80,
                    }}
                    onChange={handleChange}
                    style={{ backgroundColor: '#f5f5f5' }}
                />
            </div>
        </div>
    );
}
