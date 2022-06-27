export let moviesList = null;
export let inputSearch = null;
export let triggerMode = false;

export const createElement = ({
                                  type,
                                  attrs,
                                  container = null,
                                  position = 'append',
                                  evt = null,
                                  handler = null
                              }) => {
    const el = document.createElement(type);

    Object.keys(attrs).forEach((key) => {
        if (key !== 'innerText') el.setAttribute(key, attrs[key]);
        else el.innerHTML = attrs[key];
    });

    if (container && position === 'append') container.append(el);
    if (container && position === 'prepend') container.prepend(el);
    if (evt && handler && typeof handler === 'function') el.addEventListener(evt, handler);

    return el;
};

export const createStyle = () => {
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

export const createMarkup = () => {
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
        handler: () => triggerMode = !triggerMode
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

    moviesList = createElement({
        type: 'div',
        attrs: {class: 'movies'},
        container
    });
};

export const addMovieToList = (movie) => {
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

export const clearMovieMarkup = (el) => el && (el.innerHTML = '');
