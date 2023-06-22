import MonacoEditor from '@monaco-editor/react';
import { useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { requestParams } from '../../../CollectionsAtom';

export default function JsonEditor({ value, type, readOnly }) {
    const editorRef = useRef(null);
    const setBody = useSetRecoilState(requestParams);

    // useEffect(() => {
    //   const debouncedHandleChange = debounce(handleChange, 500);
    //   return () => {
    //     debouncedHandleChange.cancel();
    //   };
    // }, []);

    function handleChange() {
        try {
            if (type === 'reqBody') {
                setBody((prevData) => ({
                    ...prevData,
                    body: JSON.parse(editorRef.current?.getValue() || { '': '' }),
                }));
            }
        } catch (err) {
            console.log(err);
        }
    }

    function handleMount(editor) {
        editorRef.current = editor;
        editorRef.current.onDidChangeModelContent(handleChange);
        const model = editor.getModel();
        window.model = model;
        const current = model.getValue();

        try {
            const parsed = JSON.parse(current);
            model.setValue(JSON.stringify(parsed, null, 2));
        } catch (error) {
            console.error('Failed to parse JSON:', error.message);
        }
    }

    return (
        <MonacoEditor
            height="90vh"
            defaultLanguage="json"
            value={value ? JSON.stringify(value, null, 2) : type === 'responseTab' ? '{}' : JSON.stringify({ '': '' })}
            onMount={handleMount}
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
        />
    );
}
