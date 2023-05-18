import { KeyValueProps, TreeNode } from './interfaces';

export const checkValidJson = (value: any) => {
    if (typeof value === 'object') {
        return true;
    }

    try {
        JSON.parse(value.replace(/^\s+|\s+$/gm, ''));
    } catch (e) {
        console.log('request-body.checkValidJson.error', e);
        return false;
    }
    return true;
};

export function formDataToObject(formData: KeyValueProps[]) {
    const obj: any = {};
    for (let pair of formData) {
        obj[pair.key] = pair.value;
    }
    return obj;
}

export const convertObjectToFormData = (data: string | object) => {
    const keyValuePairs = [];

    if (checkValidJson(data)) {
        if (typeof data !== 'object') {
            data = JSON.parse(data);
        }

        for (const [key, value] of Object.entries(data)) {
            keyValuePairs.push({ key, value });
        }
    }
    return keyValuePairs;
};

export const structureBodyForMapping = (data: any, parentName: string, oldRef: string) => {
    let id = 1;

    function convertData(data: any, name = parentName, prevRef = oldRef): TreeNode {
        const result: TreeNode = {
            id: parentName + id.toString(),
            name,
            children: [],
            ref: prevRef + '.' + name,
        };

        id++;

        if (typeof data === 'object') {
            for (const key in data) {
                const child = convertData(data[key], key, result.ref);
                result.children.push(child);
            }
        }
        return result;
    }

    const updatedData = convertData(JSON.parse(data), parentName);

    return updatedData;
};

export function structureFormData(data: KeyValueProps[], name: string, oldRef = ''): TreeNode {
    let id = 1;
    const result: TreeNode = {
        id: name + id.toString(),
        name,
        children: [],
        ref: oldRef + '.' + name,
    };
    id++;

    data.forEach((obj) => {
        const node: TreeNode = {
            id: name + id.toString(),
            name: obj.key,
            children: [],
            ref: result.ref + '.' + obj.key,
        };
        id++;
        result.children.push(node);
    });

    return result;
}

export function ConvertResponseData(data: any[], rootName: string, rootRef: string): TreeNode {
    const parentNode: TreeNode = {
        id: 'parent-root' + rootName + (Math.random() + 1).toString(36).substring(7),
        name: rootName,
        children: [],
        ref: rootRef + '.' + rootName,
    };

    const getNode = (node: any, prevRef: string = ''): TreeNode => {
        const id = node.id ?? (Math.random() + 1).toString(36).substring(7);
        const name = node.name;
        const children: TreeNode[] = [];
        const type = node.type ?? '';
        const ref = `${prevRef}.${node.name}`;

        if (node.type === 'object' && node.properties) {
            for (const [propName, propNode] of Object.entries(node.properties)) {
                children.push(getNode(propNode, ref));
            }
        } else if (node.type === 'arrayOfObjects' && node.items && node.items.properties) {
            for (const [propName, propNode] of Object.entries(node.items.properties)) {
                children.push(getNode(propNode, ref));
            }
        }

        return { id, name, children, type, ref };
    };

    for (const node of data) {
        const childNode = getNode(node, parentNode.ref);
        parentNode.children.push(childNode);
    }

    return parentNode;
}
