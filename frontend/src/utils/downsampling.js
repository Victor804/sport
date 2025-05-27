export function downsample(array, maxPoints = 200) {
  if (array.length <= maxPoints) return array;

  const blockSize = Math.floor(array.length / maxPoints);
  const result = [];

  for (let i = 0; i < array.length; i += blockSize) {
    const block = array.slice(i, i + blockSize);
    const avg = block.reduce((sum, val) => sum + val, 0) / block.length;
    result.push(avg);
  }

  return result;
}

export function downsampleLabels(array, targetLength = 200) {
  const step = Math.floor(array.length / targetLength);
  return array.filter((_, index) => index % step === 0).slice(0, targetLength);
}