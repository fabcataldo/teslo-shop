export interface CustomSearchParams {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}