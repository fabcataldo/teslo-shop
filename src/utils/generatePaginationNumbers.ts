export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
    //si el num total de paginas es 7 o menos
    //vamos a mostrar todas las pags sin puntos suspensivos

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    //si la pag actual esta entre las primeras 3 pags
    //mostrar las primeras 3, puntos suspensivos, y las ultimas 2

    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    //si la pag actual está entre las ultimas pags
    //mostrar las primeras 2, puntos suspensivos, y luego las ultimas 3
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    //si la pag actual está en otro lugar medio
    //mostrar la 1era pag, puntos suspensivos, la pág. actual y vecinos
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];
}