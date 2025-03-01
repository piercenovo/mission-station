import { DATABASE_ID, MEMBERS_ID } from "./../../../config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { membersSchema, updateMemberSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "../utils";
import { Query } from "node-appwrite";
import { MemberRole } from "../types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", membersSchema),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            error:
              "No tienes los permisos necesarios para realizar esta acción",
          },
          401
        );
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
            role: member.role,
          };
        })
      );

      return c.json({
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json(
        {
          error: "No tienes los permisos necesarios para realizar esta acción",
        },
        401
      );
    }

    if (member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: "No tienes los permisos necesarios para realizar esta acción",
        },
        401
      );
    }

    if (member.role === MemberRole.ADMIN && member.$id === memberToDelete.$id) {
      return c.json(
        {
          error: "No puedes eliminarte a ti mismo porque eres ADMIN",
        },
        401
      );
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json(
        {
          error: "No se puede eliminar el único miembro",
        },
        401
      );
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", updateMemberSchema),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            error:
              "No tienes los permisos necesarios para realizar esta acción",
          },
          401
        );
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            error:
              "No tienes los permisos necesarios para realizar esta acción",
          },
          401
        );
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json(
          {
            error: "No se puede degradar el único miembro",
          },
          401
        );
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ data: { $id: memberToUpdate.$id } });
    }
  );

export default app;
