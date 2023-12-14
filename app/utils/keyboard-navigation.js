import { useRef, useEffect } from 'react';

export function useKeyboardNav() {
  const ref = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      // Set focus to next element
      console.log('tab');
    } else if (event.key === 'Enter') {
      // Set focus inside element
      console.log('enter');
    }
  };

  useEffect(() => {
    const currentInput = ref.current;

    if (currentInput) {
      currentInput.setAttribute('tabIndex', '0');
      currentInput.addEventListener('keydown', handleKeyDown);

      return () => {
        currentInput.removeEventListener('keydown', handleKeyDown);
      };
    }

    return () => { };
  }, [ref]);

  return ref;
}
