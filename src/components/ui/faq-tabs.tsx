'use client';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FAQPregunta {
  pregunta: string;
  respuesta: string;
}

interface FAQTabsProps {
  categorias: Record<string, string>;
  faqData: Record<string, FAQPregunta[]>;
  className?: string;
}

export default function FAQTabs({ categorias, faqData, className }: FAQTabsProps) {
  const claves = Object.keys(categorias);
  const [seleccionada, setSeleccionada] = React.useState(claves[0]);

  return (
    <div className={cn('relative w-full', className)}>
      <FAQCategorias categorias={categorias} seleccionada={seleccionada} onSeleccionar={setSeleccionada} />
      <FAQLista faqData={faqData} seleccionada={seleccionada} />
    </div>
  );
}

function FAQCategorias({
  categorias,
  seleccionada,
  onSeleccionar,
}: {
  categorias: Record<string, string>;
  seleccionada: string;
  onSeleccionar: (clave: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {Object.entries(categorias).map(([clave, etiqueta]) => (
        <button
          key={clave}
          type="button"
          onClick={() => onSeleccionar(clave)}
          className={cn(
            'relative overflow-hidden whitespace-nowrap rounded-pill border px-4 py-2 text-sm font-medium transition-colors duration-300',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasa',
            seleccionada === clave
              ? 'border-transparent text-void'
              : 'border-linea bg-transparent text-texto-2 hover:text-texto',
          )}
        >
          <span className="relative z-10">{etiqueta}</span>
          <AnimatePresence>
            {seleccionada === clave && (
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 z-0 bg-brasa"
              />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
}

function FAQLista({
  faqData,
  seleccionada,
}: {
  faqData: Record<string, FAQPregunta[]>;
  seleccionada: string;
}) {
  const preguntas = faqData[seleccionada] ?? [];
  // Con pocas preguntas, dos columnas dejan una huérfana y descentrada —
  // una sola columna se ve intencional en cualquier cantidad. El split en
  // dos recién vale la pena a partir de 5 (como PREGUNTAS_FRECUENTES).
  const dosColumnas = preguntas.length >= 5;
  const mitad = Math.ceil(preguntas.length / 2);
  const columnas = dosColumnas
    ? [preguntas.slice(0, mitad), preguntas.slice(mitad)]
    : [preguntas];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={seleccionada}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mt-10 flex flex-col gap-4',
          dosColumnas && 'md:flex-row md:items-start md:justify-center md:gap-6',
        )}
      >
        {columnas.map((columna, ci) => (
          <div key={ci} className={cn('flex w-full flex-col gap-4', dosColumnas && 'md:min-w-0 md:flex-1')}>
            {columna.map((faq, i) => (
              <FAQItem key={`${seleccionada}-${ci}-${i}`} {...faq} />
            ))}
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

function FAQItem({ pregunta, respuesta }: FAQPregunta) {
  const [abierta, setAbierta] = React.useState(false);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-praxia transition-colors duration-300',
        abierta ? 'bg-surface-2' : 'bg-surface',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 rounded-praxia border transition-colors duration-300',
          abierta ? 'border-linea-viva' : 'border-linea',
        )}
      />
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        className="relative z-10 flex w-full items-center justify-between gap-4 p-5 text-left"
      >
        <span
          className={cn(
            'font-[family-name:var(--font-titulos)] text-lg font-medium leading-snug tracking-[-0.03em] transition-colors duration-300',
            abierta ? 'text-texto' : 'text-texto-2',
          )}
        >
          {pregunta}
        </span>
        <motion.span
          animate={{ rotate: abierta ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-none"
        >
          <Plus className={cn('h-5 w-5 transition-colors duration-300', abierta ? 'text-brasa' : 'text-texto-2')} />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: abierta ? 'auto' : 0, marginBottom: abierta ? 16 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative z-10 overflow-hidden px-5"
      >
        <p className="text-texto-2" dangerouslySetInnerHTML={{ __html: respuesta }} />
      </motion.div>
    </div>
  );
}
