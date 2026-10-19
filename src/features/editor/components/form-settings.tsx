"use client";

import React from "react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";

const DEFAULT_CONFIRMATION_MESSAGE = "Your response has been recorded";

function FormSettings() {
  const params = useParams();

  const utils = api.useUtils();
  const formApi = api.form.getOne.useQuery({
    id: String(params.form),
  });

  const updateFormApi = api.form.updateForm.useMutation({
    onSuccess: async (data) => {
      await utils.form.getOne.invalidate({
        id: data.id,
      });
    },
  });

  return (
    <div className="flex flex-col gap-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Responses section */}
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Responses</ItemTitle>
                <ItemDescription>How responses are collected</ItemDescription>
                <ItemGroup>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Require sign in</ItemTitle>
                      <ItemDescription>
                        Require users to sign in to fill up this form
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.requireAuth}
                          disabled={formApi.isPending}
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              requireAuth: value,
                              sendResponseEmail:
                                value === false ? false : undefined,
                              limitOneResponse:
                                value === false ? false : undefined,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Send email responses</ItemTitle>
                      <ItemDescription>
                        Send responders a copy of their response.{" "}
                        <b>Requires auth to be true.</b>
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.sendResponseEmail}
                          disabled={
                            formApi.isPending || !formApi.data?.requireAuth
                          }
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              sendResponseEmail: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Allow response editing</ItemTitle>
                      <ItemDescription>
                        Allow response from users to be editer after submitting
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.allowResponseEditing}
                          disabled={formApi.isPending}
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              allowResponseEditing: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Limit to 1 response</ItemTitle>
                      <ItemDescription>
                        Only allow one response to be submitted per user
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.limitOneResponse}
                          disabled={
                            formApi.isPending || !formApi.data?.requireAuth
                          }
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              limitOneResponse: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </ItemContent>
            </Item>
          </ItemGroup>
          <Separator />
          {/* Presentation section */}
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Presentation</ItemTitle>
                <ItemDescription>
                  Manage how forms are presentated
                </ItemDescription>
                <ItemGroup>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Show progress bar</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.showProgressBar}
                          disabled={formApi.isPending}
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              showProgressBar: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Shuffle question order</ItemTitle>
                      <ItemDescription>
                        Present questions in a random order for every responder
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.shuffleQuestionOrder}
                          disabled={formApi.isPending}
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              shuffleQuestionOrder: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                  <Item size="sm">
                    <ItemContent>
                      <ItemTitle>Allow another response</ItemTitle>
                      <ItemDescription>
                        Show a link back to this form on the confirmation screen
                        so responders can submit again
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      {!formApi.isPending && (
                        <Switch
                          checked={formApi.data?.showLinkFormAnotherResponse}
                          disabled={formApi.isPending}
                          onCheckedChange={async (value) => {
                            await updateFormApi.mutateAsync({
                              id: String(params.form),
                              showLinkFormAnotherResponse: value,
                            });
                          }}
                        />
                      )}
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </ItemContent>
            </Item>
          </ItemGroup>
          <Separator />
          {/* Confirmation section */}
          <ItemGroup>
            <Item>
              <ItemContent>
                <ItemTitle>Confirmation</ItemTitle>
                <ItemDescription>
                  What a responder sees after submitting a response
                </ItemDescription>
                <ItemGroup>
                  <Item size="sm" className="items-start">
                    <ItemContent>
                      <ItemTitle>Confirmation message</ItemTitle>
                      <ItemDescription>
                        Shown on the screen a responder lands on after
                        submitting
                      </ItemDescription>
                      {!formApi.isPending && (
                        <Textarea
                          rows={3}
                          className="resize-none"
                          defaultValue={
                            formApi.data?.confirmationMessage ??
                            DEFAULT_CONFIRMATION_MESSAGE
                          }
                          placeholder={DEFAULT_CONFIRMATION_MESSAGE}
                          disabled={updateFormApi.isPending}
                          onBlur={(e) => {
                            const confirmationMessage = e.target.value.trim();

                            if (
                              !confirmationMessage ||
                              confirmationMessage ===
                                (formApi.data?.confirmationMessage ??
                                  DEFAULT_CONFIRMATION_MESSAGE)
                            ) {
                              return;
                            }

                            void updateFormApi.mutateAsync({
                              id: String(params.form),
                              confirmationMessage,
                            });
                          }}
                        />
                      )}
                    </ItemContent>
                  </Item>
                </ItemGroup>
              </ItemContent>
            </Item>
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  );
}

export default FormSettings;
