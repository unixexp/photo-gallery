import {
    v4 as uuidV4,
    parse as uuidParse,
    stringify as uuidStringify
} from "uuid";

export const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertUUIDStringToBuffered = (uuid) => {
    return Buffer.from(uuidParse(uuid))
}

export const convertUUIDBufferedToString = (uuid) => {
    return uuidStringify(new Uint8Array(uuid))
}

export const makeUUIDBuffered = () => {
    return convertUUIDStringToBuffered(uuidV4())
}

export const resultOK = (data) => {
    if (!data)
        data = null
    return { result: "ok", response: data }
}

export const resultError = (data) => {
    if (!data)
        data = null
    return { result: "error", error: data }
}

export const formatString = (string, params) => {
    let modified = string
    if (typeof(params) !== "object") {
        throw new Error("Params should be object (like {params: value})")
    } else {
        for (let param in params) {
            modified = modified.replace(`<${param}>`, params[param])
        }
        return modified
    }
}