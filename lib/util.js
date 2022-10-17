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
    return { result: "ok", response: data }
}

export const resultError = (data) => {
    return { result: "error", error: data }
}