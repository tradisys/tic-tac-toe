// @flow

type SwiperOptionsType = {|
    +direction?: 'horizontal' | 'vertical',
    +slidesPerView?: 'auto' | number,
    +freeMode?: boolean,
    +loop?: boolean,
    +watchOverflow?: boolean,
    +scrollbar?: {|
        +el: string, // eslint-disable-line id-length
        +hide?: boolean
    |},
    +pagination?: {|
        // eslint-disable-next-line id-length
        +el: '.swiper-pagination'
    |},
    +mousewheel?: boolean,
    +autoplay?: {|
        +delay?: number
    |}
|};

declare module 'swiper' {
    declare export default class Swiper {
        constructor(node: HTMLElement, options: SwiperOptionsType): Swiper
    }
}
