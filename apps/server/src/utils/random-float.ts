function randomFloat(min: number, max: number) {
  const random = Math.random() * (max - min) + min;
  return Number.parseFloat(random.toFixed(2));
}

export { randomFloat };
