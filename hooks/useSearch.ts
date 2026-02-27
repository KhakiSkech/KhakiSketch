'use client';

import { useState, useCallback, useMemo } from 'react';
import { Project, Article } from '@/types';

interface UseSearchProps<T> {
    items: T[];
    searchKeys: (keyof T)[];
    debounceMs?: number;
}

interface UseSearchReturn<T> {
    query: string;
    setQuery: (query: string) => void;
    results: T[];
    isSearching: boolean;
    resultsCount: number;
}

/**
 * 클라이언트 사이드 검색 Hook
 * @param items 검색할 아이템 배열
 * @param searchKeys 검색할 객체 키 배열
 * @param debounceMs 디바운스 지연 시간 (기본: 300ms)
 */
export function useSearch<T>({
    items,
    searchKeys,
    debounceMs = 300,
}: UseSearchProps<T>): UseSearchReturn<T> {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // 디바운스된 검색 쿼리 업데이트
    const handleQueryChange = useCallback(
        (newQuery: string) => {
            setQuery(newQuery);
            setIsSearching(true);

            const timeoutId = setTimeout(() => {
                setDebouncedQuery(newQuery);
                setIsSearching(false);
            }, debounceMs);

            return () => clearTimeout(timeoutId);
        },
        [debounceMs]
    );

    // 검색 로직
    const results = useMemo(() => {
        if (!debouncedQuery.trim()) {
            return items;
        }

        const lowercaseQuery = debouncedQuery.toLowerCase();

        return items.filter((item) => {
            return searchKeys.some((key) => {
                const value = item[key];

                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowercaseQuery);
                }

                if (Array.isArray(value)) {
                    return value.some((v) => {
                        if (typeof v === 'string') {
                            return v.toLowerCase().includes(lowercaseQuery);
                        }
                        return false;
                    });
                }

                return false;
            });
        });
    }, [items, searchKeys, debouncedQuery]);

    return {
        query,
        setQuery: handleQueryChange,
        results,
        isSearching,
        resultsCount: results.length,
    };
}

/**
 * 프로젝트 검색 Hook
 */
export function useProjectSearch(projects: Project[]) {
    return useSearch({
        items: projects,
        searchKeys: ['title', 'description', 'overview', 'tag'] as (keyof Project)[],
    });
}

/**
 * 아티클 검색 Hook
 */
export function useArticleSearch(articles: Article[]) {
    return useSearch({
        items: articles,
        searchKeys: ['title', 'description', 'tags', 'content'] as (keyof Article)[],
    });
}
