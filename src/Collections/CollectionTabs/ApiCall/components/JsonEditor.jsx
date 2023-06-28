import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { requestParams } from '../../../CollectionsAtom';

export default function JsonEditor({ value, type, readOnly }) {
    const divEl = useRef(null);
    let editor;
    const setBody = useSetRecoilState(requestParams);
    useEffect(() => {
        if (divEl.current) {
            editor = monaco.editor.create(divEl.current, {
                value: value ? JSON.stringify(value, null, 2) : JSON.stringify({}),
                language: 'json',
                readOnly: readOnly,
                autoClosingQuotes: 'always',
                contextmenu: false,
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
                theme: 'myCustomTheme', // Use your own custom theme
            });

            editor.onDidChangeModelContent(handleChange);
        }

        return () => {
            editor.dispose();
        };
    }, []);

    function handleChange() {
        const editorValue = editor.getValue();
        try {
            if (type === 'reqBody') {
                setBody((prevData) => ({
                    ...prevData,
                    body: JSON.parse(editorValue || {}),
                }));
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="m-4 h-full mb-16">
            <div
                className="flex flex-col"
                style={{ height: '90vh' }} // Set the desired height here
                ref={divEl}
            ></div>
        </div>
    );
}
