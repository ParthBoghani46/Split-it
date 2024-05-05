/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ExpenseFormValues, GroupFormValues } from "@/lib/schemas";
import { nanoid } from "nanoid";
const REST_API_BASE_URL = "http://localhost:8080/api/v1";

export function randomId() {
  return nanoid();
}

export async function createGroup(groupFormValues: GroupFormValues) {
  const groupId = randomId();
  const response = await axios.post(`${REST_API_BASE_URL}/groups/create`, {
    id: groupId,
    name: groupFormValues.name,
    currency: groupFormValues.currency,

    participants: groupFormValues.participants.map(({ name }) => ({
      id: randomId(),
      name,
      groupId: groupId,
    })),
  });

  return response.data;
}

export async function getGroup(groupId: string) {
  const response = await axios.get(`${REST_API_BASE_URL}/groups/${groupId}`);
  return response.data;
}

export async function createExpense(
  expenseFormValues: ExpenseFormValues,
  groupId: string
) {
  const group = await getGroup(groupId);
  if (!group) throw new Error(`Invalid group ID: ${groupId}`);

  for (const participant of [
    expenseFormValues.paidBy,
    ...expenseFormValues.paidFor.map((p) => p.participantId),
  ]) {
    if (!group.participants.some((p: any) => p.id === participant))
      throw new Error(`Invalid participant ID: ${participant}`);
  }

  const expenseId = randomId();
  const response = await axios.post(
    `${REST_API_BASE_URL}/groups/${groupId}/expenses/create`,
    {
      id: expenseId,
      groupId: groupId,
      expenseDate: expenseFormValues.expenseDate,
      categoryId: expenseFormValues.categoryId,
      amount: expenseFormValues.amount,
      title: expenseFormValues.title,
      paidBy: expenseFormValues.paidBy,
      splitMode: expenseFormValues.splitMode,
      paidFor: expenseFormValues.paidFor.map((paidFor) => ({
        expenseId: expenseId,
        participantId: paidFor.participantId,
        shares:
          paidFor.shares % 100 == 0 ? paidFor.shares / 100 : paidFor.shares,
      })),
      isReimbursement: expenseFormValues.isReimbursement,
      notes: expenseFormValues.notes,
    }
  );
  return response.data;
}

export async function deleteExpense(expenseId: string, groupId: string) {
  await axios.delete(
    `${REST_API_BASE_URL}/groups/${groupId}/expenses/${expenseId}`
  );
}

export async function getGroupExpensesParticipants(groupId: string) {
  const response = await axios.get(
    `${REST_API_BASE_URL}/groups/${groupId}/expenses`
  );
  const expenses = response.data;

  const participants = Array.from(
    new Set(
      expenses.flatMap(
        (e: { paidById: any; paidFor: { participantId: any }[] }) => [
          e.paidById,
          ...e.paidFor.map((pf: { participantId: any }) => pf.participantId),
        ]
      )
    )
  );

  return participants;
}

export async function getGroups(groupIds: string[]) {
  try {
    const groups = [];

    for (const groupId of groupIds) {
      // Define the URL of your backend endpoint for fetching a single group by ID

      // Send a GET request to fetch the group by ID
      const response = await getGroup(groupId);

      // Handle the response data
      const group = response.data;
      groups.push(group);
    }

    return groups;
  } catch (error) {
    // Handle errors
    console.error("Error fetching groups:", error);
    throw error;
  }
}
export async function updateExpense(
  groupId: string,
  expenseId: string,
  expenseFormValues: ExpenseFormValues
) {
  try {
    console.log(expenseFormValues);
    const response = await axios.put(
      `${REST_API_BASE_URL}/groups/${groupId}/expenses/${expenseId}`,
      {
        expenseDate: expenseFormValues.expenseDate,
        categoryId: expenseFormValues.categoryId,
        amount: expenseFormValues.amount,
        title: expenseFormValues.title,
        paidBy: expenseFormValues.paidBy,
        splitMode: expenseFormValues.splitMode,
        paidFor: expenseFormValues.paidFor.map((paidFor) => ({
          expenseId: expenseId,
          participantId: paidFor.participantId,
          shares:
            paidFor.shares % 100 == 0 ? paidFor.shares / 100 : paidFor.shares,
        })),
        isReimbursement: expenseFormValues.isReimbursement,
        notes: expenseFormValues.notes,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

export async function updateGroup(
  groupId: string,
  groupFormValues: GroupFormValues
) {
  try {
    // Fetch the existing group data to compare participants
    const existingGroupResponse = await axios.get(
      `${REST_API_BASE_URL}/groups/${groupId}`
    );
    const existingGroupData = existingGroupResponse.data;

    // Extract old and new participant arrays
    const oldParticipants = existingGroupData.participants;
    const newParticipants = groupFormValues.participants;

    // Find participants to delete (in oldParticipants but not in newParticipants)
    const participantsToDelete = oldParticipants.filter(
      (oldParticipant: { id: string | undefined }) =>
        !newParticipants.some(
          (newParticipant) => newParticipant.id === oldParticipant.id
        )
    );

    console.log(participantsToDelete);
    // Find participants to add (in newParticipants but not in oldParticipants)
    const participantsToAdd = newParticipants.filter(
      (newParticipant) =>
        !oldParticipants.some(
          (oldParticipant: { id: string | undefined }) =>
            oldParticipant.id === newParticipant.id
        )
    );

    for (const participant of participantsToDelete) {
      await deleteParticipant(groupId, participant);
    }

    // Add participants to add
    for (const participant of participantsToAdd) {
      await addParticipant(groupId, participant);
    }
    // Update the group with the new data
    const response = await axios.put(
      `${REST_API_BASE_URL}/groups/${groupId}`,
      groupFormValues
    );

    return response.data;
  } catch (error) {
    console.error("Error updating group:", error);
    throw error;
  }
}

async function deleteParticipant(
  groupId: string,
  participant: { name: string; id?: string | undefined }
) {
  try {
    console.log(participant);
    // Perform add participant request
    await axios.delete(
      `${REST_API_BASE_URL}/groups/${groupId}/participants/${participant.id}`
    );
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error;
  }
}

async function addParticipant(
  groupId: string,
  participant: { name: string; id?: string | undefined }
) {
  try {
    // Perform add participant request
    await axios.post(`${REST_API_BASE_URL}/groups/${groupId}/participants`, {
      id: randomId(),
      name: participant.name,
      groupId: groupId,
    });
  } catch (error) {
    console.error("Error adding participant:", error);
    throw error;
  }
}
export async function getCategories() {
  try {
    const response = await axios.get(`${REST_API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getGroupExpenses(groupId: string) {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/groups/${groupId}/expenses`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching group expenses:", error);
    throw error;
  }
}

export async function getExpense(groupId: string, expenseId: string) {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/groups/${groupId}/expenses/${expenseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching expense:", error);
    throw error;
  }
}

export async function getCategory(categoryId: string) {
  try {
    const response = await axios.get(
      `${REST_API_BASE_URL}/categories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
