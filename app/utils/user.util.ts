import { Users } from "../DB/models/models.js";
import { IUser } from "../DB/models/user.model.js";

export enum GuideSideEnum {
  LEFT = "left",
  RIGHT = "right",
}

export interface TreeNode {
  id: string;
  name: string;
  left?: TreeNode | null;
  right?: TreeNode | null;
}

export async function fetchUserBySmId(smId: string): Promise<IUser | null> {
  return Users.findOne({ smId: smId });
}

// Function to build binary tree
export async function buildBinaryTree(smId: string): Promise<TreeNode | null> {
  const user = await fetchUserBySmId(smId);
  if (!user) return null;

  if (smId === user.leftChild || smId === user.rightChild) {
    new Error("Child ID same as parent!");
  }
  const leftChild = user.leftChild
    ? await buildBinaryTree(user.leftChild)
    : null;
  const rightChild = user.rightChild
    ? await buildBinaryTree(user.rightChild)
    : null;

  return {
    id: user.smId,
    name: user.name,
    left: leftChild,
    right: rightChild,
  };
}
