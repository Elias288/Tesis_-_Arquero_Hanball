
type optionsType = {
  method: string;
  body?: string;
  headers: { 'Content-Type'?: string; Authorization?: string };
};

const fetchData = (
  url: string, // url de la petición sin la url
  optionsVal: optionsType, // opciones de la petición
  callback: (res: any) => any, // función que se ejecuta sobre el resultado de la petición
  errorCallback: (res: any) => void, // función que se ejecuta sobre el error de la petición
  timeOut: number // tiempo maximo en el que se espera la petición
): Promise<any> => {
  const controller = new AbortController();
  const timerOut = setTimeout(() => {
    controller.abort();
  }, timeOut);

  const options = {
    ...optionsVal,
    signal: controller.signal,
  };

  return fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/${url}`, options)
    .then((res) => res.json())
    .then((result: any) => {
      clearTimeout(timerOut);
      return callback(result);
    })
    .catch((err) => {
      clearTimeout(timerOut);
      return errorCallback(err);
    });
};

export default fetchData;
