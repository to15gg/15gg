import NextImage, {
  ImageProps as NextImageProps,
  ImageLoader,
} from "next/image";

const normalizeSrc = (src: string) => {
  return src.startsWith("/") ? src.slice(1) : src;
};

const cloudflareLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [`width=${width}`];
  if (quality) {
    params.push(`quality=${quality}`);
  }
  const paramsString = params.join(",");
  return `/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
};

export type ImageProps = Omit<NextImageProps, "loader">;

export default function Image(props: ImageProps) {
  return <NextImage loader={cloudflareLoader} {...props} />;
}
