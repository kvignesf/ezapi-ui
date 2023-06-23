import MonacoEditor from '@monaco-editor/react';
import { useSetRecoilState } from 'recoil';
import { requestParams } from '../../../CollectionsAtom';

export default function JsonEditor({ value, type, readOnly }) {
    const setBody = useSetRecoilState(requestParams);

    // useEffect(() => {
    //   const debouncedHandleChange = debounce(handleChange, 500);
    //   return () => {
    //     debouncedHandleChange.cancel();
    //   };
    // }, []);

    function handleChange(value) {
        try {
            if (type === 'reqBody') {
                setBody((prevData) => ({
                    ...prevData,
                    body: JSON.parse(value || {}),
                }));
            }
        } catch (err) {
            console.log(err);
        }
    }

    // function handleMount(editor) {
    //     editorRef.current = editor;
    //     editorRef.current.onDidChangeModelContent(handleChange);
    //     const model = editor.getModel();
    //     window.model = model;
    //     const current = model.getValue();

    //     try {
    //         const parsed = JSON.parse(current);
    //         model.setValue(JSON.stringify(parsed, null, 2));
    //     } catch (error) {
    //         console.error('Failed to parse JSON:', error.message);
    //     }
    // }

    return (
        <div className="m-4 h-full mb-16">
            <div className="  flex flex-col" style={{ height: `calc(100% - 80px)` }}>
                <MonacoEditor
                    height="90vh"
                    language="json"
                    value={value ? JSON.stringify(value, null, 2) : '{}'}
                    options={{
                        autoClosingBrackets: false,
                        contextmenu: false,
                        readOnly: readOnly,
                        format: 'prettier',
                        minimap: {
                            enabled: false,
                        },
                        renderWhitespace: 'all',
                        scrollbar: {
                            horizontal: 'hidden',
                        },
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
