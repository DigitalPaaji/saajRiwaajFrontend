export const getOptimizedImage = (
  url,
  { quality = "auto:eco", maxWidth = 1600, format = "auto" } = {}
) => {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("cloudinary")) return url;

  return url.replace(
    "/upload/",
    `/upload/f_${format},q_${quality},c_limit,w_${maxWidth},dpr_auto/`
  );
};
