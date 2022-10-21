import React, { useState, useEffect, SVGProps } from 'react';
import { useTheme } from 'styled-components';

import api from '~/services/api';
import iconTypePokemon from '~/assets/types';
import { Pokeball } from '~/assets/patterns';

import {
  Container,
  Pokemon,
  PokemonNumber,
  PokemonName,
  PokemonType,
} from './styles';

interface PokemonTypesProps {
  name: string;
  color: string;
  icon: SVGProps<SVGSVGElement>;
}

interface PokemonProps {
  id: string;
  image: string;
  type: PokemonTypesProps[];
  backgroundColor: string;
}

const CardPokemon: React.FC<{ name: string }> = ({ name }) => {
  const { colors } = useTheme();
  const [pokemon, setPokemon] = useState({} as PokemonProps);

  useEffect(() => {
    api.get(`/pokemon/${name}`).then(response => {
      const { id, types, sprites } = response.data;

      let backgroundColor: keyof typeof iconTypePokemon = types[0].type.name;

      // Any pokemon with two classes or more and whose first class is "normal",
      // This codicinal forces to take the second class, the reason for this flow is to better style the app layout
      if (backgroundColor === 'normal' && types.length > 1) {
        backgroundColor = types[1].type.name;
      }

      setPokemon({
        id,
        backgroundColor: colors.backgroundType[backgroundColor],
        image: sprites.other['official-artwork'].front_default,
        type: types.map((pokemonType: any) => {
          // Recognize the variable as a key to the pokemonTypes and colors.type arrays
          const typeName = pokemonType.type
            .name as keyof typeof iconTypePokemon;

          return {
            name: typeName,
            icon: iconTypePokemon[typeName],
            color: colors.type[typeName],
          };
        }),
      });
    });
  }, [name, colors]);

  return (
    <Container to={`pokemon/${name}`} color={pokemon.backgroundColor}>
      <Pokemon>
        <PokemonNumber>#{pokemon.id}</PokemonNumber>
        <PokemonName>{name}</PokemonName>
        {pokemon.type && (
          <div>
            {pokemon.type.map(pokemonType => (
              <PokemonType color={pokemonType.color} key={pokemonType.name}>
                {pokemonType.icon} <span>{pokemonType.name}</span>
              </PokemonType>
            ))}
          </div>
        )}
        <Pokeball />
      </Pokemon>
      {pokemon.image && (
        <img src={pokemon.image} alt={`Pokemon image ${name}`} />
      )}
    </Container>
  );
};

export default CardPokemon;
