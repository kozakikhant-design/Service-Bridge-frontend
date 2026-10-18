export function formatProvider(provider) {
  return {
    ...provider,
    id: provider._id,
    name: provider.user?.name || "Provider",
    avatar: provider.user?.avatar || provider.category?.icon || "🧰",
    category: provider.category?.name || "Service provider",
    categoryId: provider.category?._id,
    reviews: provider.reviewCount || 0,
    experience: provider.experience || "",
    description: provider.description || "",
  };
}

export function formatBooking(booking) {
  return {
    ...booking,
    id: booking._id,
    serviceName: booking.service?.name || "Service",
    providerName: booking.provider?.user?.name || "Provider",
    providerAvatar: booking.provider?.user?.avatar || booking.provider?.category?.icon || "🧰",
    dateLabel: booking.date ? new Date(booking.date).toLocaleDateString() : "—",
  };
}
