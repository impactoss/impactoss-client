export default function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
