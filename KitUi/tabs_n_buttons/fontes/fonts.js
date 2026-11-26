/* Acervo local de fontes — índices e metadados. */
(function () {
  'use strict';

  /* Acervo local de fontes. O campo gf registra apenas a origem (Google Fonts)
     como referência; o carregamento é feito por tabs_n_buttons/fontes/fonts.css. */
  const FONTS = [
    { id: 'Inter', name: 'Inter', stack: 'Inter, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Inter:wght@400;500;600;700' },
    { id: 'Manrope', name: 'Manrope', stack: 'Manrope, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Manrope:wght@400;500;600;700;800' },
    { id: 'Sora', name: 'Sora', stack: 'Sora, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Sora:wght@400;500;600;700' },
    { id: 'Space Grotesk', name: 'Space Grotesk', stack: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Space+Grotesk:wght@400;500;600;700' },
    { id: 'DM Sans', name: 'DM Sans', stack: '"DM Sans", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'DM+Sans:wght@400;500;600;700' },
    { id: 'Archivo', name: 'Archivo', stack: 'Archivo, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Archivo:wght@400;500;600;700;800' },
    { id: 'Bricolage', name: 'Bricolage Grotesque', stack: '"Bricolage Grotesque", ui-sans-serif, sans-serif', cat: 'Sans', gf: 'Bricolage+Grotesque:wght@400;600;700' },
    { id: 'Nunito', name: 'Nunito', stack: 'Nunito, ui-rounded, system-ui, sans-serif', cat: 'Sans', gf: 'Nunito:wght@400;600;700;800' },
    { id: 'Geist', name: 'Geist', stack: 'Geist, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Geist:wght@400;500;600;700' },
    { id: 'Figtree', name: 'Figtree', stack: 'Figtree, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Figtree:wght@400;500;600;700' },
    { id: 'Outfit', name: 'Outfit', stack: 'Outfit, ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Outfit:wght@400;500;600;700' },
    { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', stack: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Plus+Jakarta+Sans:wght@400;500;600;700' },
    { id: 'Schibsted Grotesk', name: 'Schibsted Grotesk', stack: '"Schibsted Grotesk", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Schibsted+Grotesk:wght@400;500;600;700' },
    { id: 'Instrument Sans', name: 'Instrument Sans', stack: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Instrument+Sans:wght@400;500;600;700' },
    { id: 'Public Sans', name: 'Public Sans', stack: '"Public Sans", ui-sans-serif, system-ui, sans-serif', cat: 'Sans', gf: 'Public+Sans:wght@400;500;600;700' },
    { id: 'Instrument Serif', name: 'Instrument Serif', stack: '"Instrument Serif", Georgia, serif', cat: 'Serif', gf: 'Instrument+Serif:ital@0;1' },
    { id: 'Source Serif 4', name: 'Source Serif 4', stack: '"Source Serif 4", Georgia, serif', cat: 'Serif', gf: 'Source+Serif+4:wght@400;600;700' },
    { id: 'Lora', name: 'Lora', stack: 'Lora, Georgia, serif', cat: 'Serif', gf: 'Lora:wght@400;500;600;700' },
    { id: 'Playfair Display', name: 'Playfair Display', stack: '"Playfair Display", Georgia, serif', cat: 'Serif', gf: 'Playfair+Display:wght@400;600;700' },
    { id: 'Fraunces', name: 'Fraunces', stack: 'Fraunces, Georgia, serif', cat: 'Serif', gf: 'Fraunces:wght@400;600;700' },
    { id: 'Newsreader', name: 'Newsreader', stack: 'Newsreader, Georgia, serif', cat: 'Serif', gf: 'Newsreader:wght@400;500;600;700' },
    { id: 'Literata', name: 'Literata', stack: 'Literata, Georgia, serif', cat: 'Serif', gf: 'Literata:wght@400;500;600;700' },
    { id: 'Petrona', name: 'Petrona', stack: 'Petrona, Georgia, serif', cat: 'Serif', gf: 'Petrona:wght@400;500;600;700' },
    { id: 'Bitter', name: 'Bitter', stack: 'Bitter, Georgia, serif', cat: 'Serif', gf: 'Bitter:wght@400;500;600;700' },
    { id: 'Crimson Pro', name: 'Crimson Pro', stack: '"Crimson Pro", Georgia, serif', cat: 'Serif', gf: 'Crimson+Pro:wght@400;500;600;700' },
    { id: 'DM Serif Display', name: 'DM Serif Display', stack: '"DM Serif Display", Georgia, serif', cat: 'Serif', gf: 'DM+Serif+Display' },
    { id: 'JetBrains Mono', name: 'JetBrains Mono', stack: '"JetBrains Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'JetBrains+Mono:wght@400;500;700' },
    { id: 'IBM Plex Mono', name: 'IBM Plex Mono', stack: '"IBM Plex Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'IBM+Plex+Mono:wght@400;500;600' },
    { id: 'Space Mono', name: 'Space Mono', stack: '"Space Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Space+Mono:wght@400;700' },
    { id: 'Azeret Mono', name: 'Azeret Mono', stack: '"Azeret Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Azeret+Mono:wght@400;500;700' },
    { id: 'Fira Code', name: 'Fira Code', stack: '"Fira Code", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Fira+Code:wght@400;500;600;700' },
    { id: 'Geist Mono', name: 'Geist Mono', stack: '"Geist Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Geist+Mono:wght@400;500;600;700' },
    { id: 'Martian Mono', name: 'Martian Mono', stack: '"Martian Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Martian+Mono:wght@400;500;600;700' },
    { id: 'DM Mono', name: 'DM Mono', stack: '"DM Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'DM+Mono:wght@400;500' },
    { id: 'Fragment Mono', name: 'Fragment Mono', stack: '"Fragment Mono", ui-monospace, Consolas, monospace', cat: 'Mono', gf: 'Fragment+Mono' },
    { id: 'Archivo Black', name: 'Archivo Black', stack: '"Archivo Black", Impact, sans-serif', cat: 'Display', gf: 'Archivo+Black' },
    { id: 'Oswald', name: 'Oswald', stack: 'Oswald, Impact, sans-serif', cat: 'Display', gf: 'Oswald:wght@400;500;600;700' },
    { id: 'Unbounded', name: 'Unbounded', stack: 'Unbounded, Impact, sans-serif', cat: 'Display', gf: 'Unbounded:wght@400;500;600;700' },
    { id: 'Bungee', name: 'Bungee', stack: 'Bungee, Impact, sans-serif', cat: 'Display', gf: 'Bungee' },
    { id: 'Climate Crisis', name: 'Climate Crisis', stack: '"Climate Crisis", Impact, sans-serif', cat: 'Display', gf: 'Climate+Crisis' },
    { id: 'Rubik Glitch', name: 'Rubik Glitch', stack: '"Rubik Glitch", Impact, sans-serif', cat: 'Display', gf: 'Rubik+Glitch' },
    { id: 'Pixelify Sans', name: 'Pixelify Sans', stack: '"Pixelify Sans", ui-monospace, Consolas, monospace', cat: 'Pixel', gf: 'Pixelify+Sans:wght@400;500;600;700' },
    { id: 'Silkscreen', name: 'Silkscreen', stack: 'Silkscreen, "Courier New", monospace', cat: 'Pixel', gf: 'Silkscreen:wght@400;700' },
    { id: 'Press Start 2P', name: 'Press Start 2P', stack: '"Press Start 2P", "Courier New", monospace', cat: 'Pixel', gf: 'Press+Start+2P' },
    { id: 'Jersey 10', name: 'Jersey 10', stack: '"Jersey 10", "Courier New", monospace', cat: 'Pixel', gf: 'Jersey+10' },
    { id: 'Jersey 25', name: 'Jersey 25', stack: '"Jersey 25", "Courier New", monospace', cat: 'Pixel', gf: 'Jersey+25:wght@400;500;600;700' },
    { id: 'Tiny5', name: 'Tiny5', stack: 'Tiny5, "Courier New", monospace', cat: 'Pixel', gf: 'Tiny5' },
    { id: 'Micro 5', name: 'Micro 5', stack: '"Micro 5", "Courier New", monospace', cat: 'Pixel', gf: 'Micro+5' },
    { id: 'Handjet', name: 'Handjet', stack: 'Handjet, ui-monospace, Consolas, monospace', cat: 'Pixel', gf: 'Handjet:wght@400;500;700' },
    { id: 'DotGothic16', name: 'DotGothic16', stack: 'DotGothic16, "Courier New", monospace', cat: 'Pixel', gf: 'DotGothic16' },
    { id: 'Sixtyfour', name: 'Sixtyfour', stack: 'Sixtyfour, "Courier New", monospace', cat: 'Pixel', gf: 'Sixtyfour' },
    { id: 'Workbench', name: 'Workbench', stack: 'Workbench, "Courier New", monospace', cat: 'Pixel', gf: 'Workbench' },
    { id: 'Jacquard 12', name: 'Jacquard 12', stack: '"Jacquard 12", "Courier New", monospace', cat: 'Pixel', gf: 'Jacquard+12' },
    { id: 'Jacquard 24', name: 'Jacquard 24', stack: '"Jacquard 24", "Courier New", monospace', cat: 'Pixel', gf: 'Jacquard+24' },
    { id: 'VT323', name: 'VT323', stack: 'VT323, ui-monospace, Consolas, monospace', cat: 'Pixel', gf: 'VT323' },
  ];

  /* Tamanho mínimo padrão definido pelo Kit UI para cada asset de fonte.
     Pode ser redefinido nas propriedades quando a fonte é aplicada ao estilo. */
  const DEFAULT_MIN = 11.5;
  FONTS.forEach((f) => {
    if (f.min === null || f.min === undefined) f.min = DEFAULT_MIN;
  });

  window.KIT_TOKENS = Object.assign(window.KIT_TOKENS || {}, {
    FONTS,
    DEFAULT_MIN,
    fontById: (id) => FONTS.find((f) => f.id === id) || FONTS[0],
  });
})();
