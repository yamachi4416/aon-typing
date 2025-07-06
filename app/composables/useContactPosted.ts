export function useContactPosted() {
  const isPosted = useState(() => false)

  function setIsPosted() {
    isPosted.value = true
  }

  function clearIsPosted() {
    isPosted.value = false
  }

  return {
    isPosted: readonly(isPosted),
    setIsPosted,
    clearIsPosted,
  }
}
