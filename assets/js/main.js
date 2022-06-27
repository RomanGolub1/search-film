let moviesList = null;
let inputSearch = null;
let triggerMode = false;

const createElement = ({
                           type,
                           attrs,
                           container = null,
                           position = 'append',
                           evt = null,
                           handler = null
                       }) => {
    const el = document.createElement(type);

    Object.keys(attrs).forEach((key) => {
        if (key !== 'innerText') {
            el.setAttribute(key, attrs[key]);
        } else {
            el.innerHTML = attrs[key];
        }
    });

    if (container && position === 'append') container.append(el);
    if (container && position === 'prepend') container.prepend(el);

    return el;
}

const createStyle = () => {
    createElement({
        type: 'style',
        attrs: {
            innerText: `
    * {
    box-sizing: border-box;
}

body {
    margin: 0;
}

.container {
    padding: 20px;
}

.movies {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.movie {
    display: flex;
    align-content: center;
    justify-content: center;
}

.movie__image {
    width: 100%;
    object-fit: cover;
}

.search {
    margin-bottom: 30px;
}

.search__label-input {
    display: block;
    margin-bottom: 7px;
}

.search__input {
    display: block;
    padding: 10px 15px;
    max-width: 400px;
    width: 100%;
    border: 1px solid lightgrey;
    border-radius: 4px;
    margin-bottom: 10px;
}

.search__label-checkbox {
    display: block;
    font-size: 12px;
    margin-top: -17px;
    margin-left: 25px;
}`
        },
        container: document.head
    });
};

const triggerModeHandler = () => triggerMode = !triggerMode;

const createMarkup = () => {
    const container = createElement({
        type: 'div',
        attrs: {class: 'container'},
        container: document.body,
        position: 'prepend'
    });

    createElement({
        type: 'h1',
        attrs: {innerText: 'Додаток для пошуку фільмів'},
        container
    });

    const searchBox = createElement({
        type: 'div',
        attrs: {class: 'search'},
        container
    });

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-input',
            for: 'search',
            innerText: 'Пошук фільмів'
        },
        container: searchBox
    });

    inputSearch = createElement({
        type: 'input',
        attrs: {
            class: 'search__input',
            id: 'search',
            placeholder: 'Почніть вводити текст...'
        },
        container: searchBox
    });

    createElement({
        type: 'input',
        attrs: {
            class: 'search__checkbox',
            id: 'checkbox',
            type: 'checkbox'
        },
        container: searchBox,
        position: 'append',
        evt: 'click',
        handler: triggerModeHandler
    });

    createElement({
        type: 'label',
        attrs: {
            class: 'search__label-checkbox',
            for: 'checkbox',
            innerText: 'Добавляти фільми до існуючого списку'
        },
        container: searchBox
    });


    createElement({
        type: 'div',
        attrs: {class: 'movies'},
        container
    });


    inputSearch = document.querySelector('#search');
};

const addMovieToList = (movie) => {
    const item = createElement({
        type: 'div',
        attrs: {class: 'movie'},
        container: moviesList
    });

    createElement({
        type: 'img',
        attrs: {
            src: /^(http|https):\/\//i.test(movie.Poster) ? movie.Poster : 'assets/image/no-image.jpg',
            class: 'movie__image',
            alt: movie.Title,
            title: movie.Title
        }, container: item
    });
};

const getData = (url) => fetch(url)
    .then((res) => res.json())
    .then((json) => {

        if (!json || !json.Search) throw Error('Сервер повернув не правильну відповідь.')

        return json.Search;
    });

const delay = (() => {
    let timer = 0;

    return (cb, ms) => {
        clearTimeout(timer)
        timer = setTimeout(cb, ms)
    };
})();

const clearMovieMarkup = () => moviesList && (moviesList.innerHTML = '');

const siteUrl = 'http://www.omdbapi.com/';
let searchLast = ' ';

createMarkup();
createStyle();

inputSearch.addEventListener('keyup', (e) => {
    delay(() => {

        const searchString = e.target.value.trim();

        if (searchString && searchString.length > 3 && searchString !== searchLast) {
            if (!triggerMode) clearMovieMarkup();

            getData(`${siteUrl}?apikey=18b8609f&s=${searchString}`)
                .then((movies) => movies.forEach((movie) => addMovieToList(movie)))
                .catch((err) => console.error(err));
        }

        searchLast = searchString;
    }, 2000);


});

