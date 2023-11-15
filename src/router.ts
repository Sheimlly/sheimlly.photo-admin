// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/categories`
  | `/categories/:id`
  | `/categories/add`
  | `/login`
  | `/photos`
  | `/photos/:id`
  | `/photos/add`
  | `/sessions`
  | `/sessions/:id`
  | `/sessions/add`

export type Params = {
  '/categories/:id': { id: string }
  '/photos/:id': { id: string }
  '/sessions/:id': { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
