import { Dispatch, SetStateAction, useCallback, useState } from "react"

const useInput = (initialValue: string): [string, Dispatch<SetStateAction<string>>, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
    const [value, setValue] = useState(initialValue);
    const onChangeForm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);
    return [value, setValue, onChangeForm];
};

export default useInput;