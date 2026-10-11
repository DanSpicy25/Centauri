import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <span className="text-4xl font-mono font-bold text-[#7C3AED] mb-3">404</span>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#141413] mb-2 font-editorial-heading">
        Página no encontrada
      </h1>
      <p className="text-sm text-[#5C5B56] max-w-md mb-6 leading-relaxed">
        La ruta a la que intentas acceder no existe o fue reubicada en la plataforma.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Regresar a la página de Inicio
        </Button>
      </Link>
    </div>
  );
};

