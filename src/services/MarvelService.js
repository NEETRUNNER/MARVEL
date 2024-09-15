class MarvelService {

    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=9eea50e05b101c3590f1ec3995f0c977';
    _baseOffset = 55;
    
    getResource = async (url) => { // Метод получает api адрес и обрабатывает его
        try {
            let resource = await fetch(url);
            return await resource.json();
        } catch (error) {
            throw new Error(`Не правильный ${url} запрос, статус: ${error.status}`);
        }
    }

    getItemCharacter = async (offset = this._baseOffset) => { 
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        // Применяем map для трансформации каждого персонажа
        console.log(res)
        console.log('Список компонентов срендерился')
        return res.data.results.map(this._transformCharacterItem);
    }

    getCharacter = async (id) => {
        let res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        console.log('Компонент срендерился')
        return this._transformCharacter(res.data.results[0]);
    }

    _transformCharacter = (char) => { // Нижний черточка ставится для того чтобы понимать, что эту функцию нельзя трогать
        // Использовав char как аргумент мы передаем в него путь использования нашего обьекта, и получается resource() это ссылка и от этой ссылки мы получаем путь res.data.results[первый массив] и name
        return {
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0],
            wiki: char.urls[1],
            comics: char.comics.items
        }
    }

    _transformCharacterItem = (char) => { // Нижний черточка ставится для того чтобы понимать, что эту функцию нельзя трогать
        return {
            name: char.name,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            id: char.id
        }
    }

}

export default MarvelService;