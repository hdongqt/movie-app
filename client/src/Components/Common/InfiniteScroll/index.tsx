import React, { isValidElement, useEffect, useRef } from 'react';

interface IInfiniteScroll {
    children: React.ReactNode;
    loader?: JSX.Element;
    fetchMore: () => void;
    hasMore: boolean;
    endMessage?: string;
    className?: string;
    loadingComponent: JSX.Element;
    isLoading: boolean;
}

const InfiniteScroll: React.FC<IInfiniteScroll> = ({
    children,
    fetchMore,
    hasMore,
    endMessage,
    className,
    loadingComponent,
    isLoading
}: IInfiniteScroll) => {
    const pageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore && !isLoading) {
                fetchMore();
            }
        };
        if (pageEndRef.current && hasMore) {
            const observer = new IntersectionObserver(handleIntersect);
            observer.observe(pageEndRef.current);
            return () => {
                observer.disconnect();
            };
        }
    }, [fetchMore, hasMore]);

    return (
        <div className={className}>
            {children}
            {hasMore ? (
                <>
                    <div ref={pageEndRef}></div>
                </>
            ) : (
                !isLoading &&
                endMessage && (
                    <p className="text-base text-center pt-4 font-medium dark:text-white/80">
                        {endMessage}
                    </p>
                )
            )}
            {isLoading && loadingComponent}
        </div>
    );
};

export default InfiniteScroll;
