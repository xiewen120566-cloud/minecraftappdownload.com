 

export const runtime = "edge";

import { getCategories, getGames } from "@/actions";
import { Locale } from "@/i18n/routing";
import {
  Container,
  Grid,
  GridItem,
  Flex,
  VStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getTargetHref, randomGames } from "@/utils";
import Info from "@/components/info";
import { getTranslations } from "next-intl/server";
import GameItem from "@/components/game-item";
import { FaChevronRight } from "react-icons/fa6";
import ElTemplate from "@/components/el-temlplate";
interface Props {
  params: {
    locale: Locale;
  };
  searchParams: Record<string, string>;
}

export default async function Page({
  params: { locale },
  searchParams,
}: Props) {
  const baseUrlInput = (process.env.BASE_URL ?? "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "");
  const baseUrl = baseUrlInput || "https://minecraftappdownload.com";
  const normalizedBaseUrl =
    baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
      ? baseUrl
      : `https://${baseUrl}`;
  const { hostname } = new URL(normalizedBaseUrl);
  const allGames = await getGames(locale);
  const categories = await getCategories(locale);
  const t = await getTranslations({ locale, namespace: "Common" });

  const newGames = randomGames(allGames.length, 8).map((item) => allGames[item]);
  const topGames = randomGames(allGames.length, 8).map((item) => allGames[item]);

  const chunkBy = <T,>(items: T[], size: number) => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      chunks.push(items.slice(i, i + size));
    }
    return chunks;
  };

  const renderBigSmallGrid = (items: typeof newGames, keyPrefix: string) => {
    const groups = chunkBy(items, 3);
    return (
      <VStack alignItems="stretch" gap={{ base: 3, md: 4, lg: 6 }}>
        {groups.map((group, groupIndex) => {
          if (group.length === 1) {
            return (
              <Grid
                key={`${keyPrefix}-${groupIndex}`}
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(10, 1fr)" }}
                gap={{ base: 3, md: 4, lg: 6 }}
              >
                <GridItem colSpan={{ base: 2, md: 10 }}>
                  <GameItem data={group[0]} locale={locale} channel={searchParams?.channel} />
                </GridItem>
              </Grid>
            );
          }

          if (group.length === 2) {
            return (
              <Grid
                key={`${keyPrefix}-${groupIndex}`}
                templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(10, 1fr)" }}
                gap={{ base: 3, md: 4, lg: 6 }}
              >
                <GridItem colSpan={{ base: 1, md: 5 }}>
                  <GameItem data={group[0]} locale={locale} channel={searchParams?.channel} />
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 5 }}>
                  <GameItem data={group[1]} locale={locale} channel={searchParams?.channel} />
                </GridItem>
              </Grid>
            );
          }

          return (
            <Grid
              key={`${keyPrefix}-${groupIndex}`}
              templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(10, 1fr)" }}
              templateRows={{ md: "repeat(2, auto)" }}
              gap={{ base: 3, md: 4, lg: 6 }}
            >
              <GridItem colSpan={{ base: 2, md: 4 }} rowSpan={{ md: 2 }}>
                <GameItem data={group[0]} locale={locale} channel={searchParams?.channel} />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 6 }} colStart={{ md: 5 }} rowStart={{ md: 1 }}>
                <GameItem data={group[1]} locale={locale} channel={searchParams?.channel} />
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 6 }} colStart={{ md: 5 }} rowStart={{ md: 2 }}>
                <GameItem data={group[2]} locale={locale} channel={searchParams?.channel} />
              </GridItem>
            </Grid>
          );
        })}
      </VStack>
    );
  };

  return (
    <>
      <Header hostname={hostname} categories={categories} />
      <Container maxWidth="container.xl" px={{ base: 3, md: 4, lg: 6 }} py={{ base: 4, md: 6 }}>
        <ElTemplate id="div-gpt-ad-1775227994462-0" style={{ minWidth: 300, minHeight: 250 }} />
        <VStack alignItems="stretch" gap={{ base: 6, md: 8 }}>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              px={{ base: 4, md: 5 }}
              py={{ base: 3, md: 4 }}
              borderBottom="1px solid"
              borderColor="border.subtle"
            >
              <Heading
                fontSize={{ base: "md", md: "lg" }}
                textTransform="uppercase"
                color="text.primary"
              >
                {t("Games", { category: t("New") })}
              </Heading>
            </Flex>
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              {renderBigSmallGrid(newGames, "new")}
            </Box>
          </Box>
          <Box
            bg="surface.1"
            border="1px solid"
            borderColor="border.subtle"
            rounded={{ base: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <Flex
              alignItems="center"
              justifyContent="space-between"
              px={{ base: 4, md: 5 }}
              py={{ base: 3, md: 4 }}
              borderBottom="1px solid"
              borderColor="border.subtle"
            >
              <Heading
                fontSize={{ base: "md", md: "lg" }}
                textTransform="uppercase"
                color="text.primary"
              >
                {t("Games", { category: t("Top") })}
              </Heading>
            </Flex>
            <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
              {renderBigSmallGrid(topGames, "top")}
            </Box>
          </Box>
          {categories.map((category) => {
            const games = allGames.filter(
              (game) => game.categoryId === category.id
            );
            const gamesList = randomGames(games.length, 8).map((item) => games[item]);
            if (!gamesList.length) {
              return null
            }

            return (
              <Box
                key={category.alias}
                bg="surface.1"
                border="1px solid"
                borderColor="border.subtle"
                rounded={{ base: "xl", md: "2xl" }}
                overflow="hidden"
              >
                <Flex
                  alignItems="center"
                  justifyContent="space-between"
                  px={{ base: 4, md: 5 }}
                  py={{ base: 3, md: 4 }}
                  borderBottom="1px solid"
                  borderColor="border.subtle"
                >
                  <Flex justifyContent="space-between" w="full" alignItems="center" gap={4}>
                    <Heading
                      fontSize={{ base: "md", md: "lg" }}
                      color="text.primary"
                      textTransform="uppercase"
                    >
                      {t("Games", { category:  category.name})}
                    </Heading>
                    <Flex
                      alignItems="center"
                      as="a"
                      href={getTargetHref(
                        locale,
                        `/category/${category.alias}`,
                        searchParams?.channel
                      )}
                      alignSelf="flex-end"
                      color="text.muted"
                      fontWeight="bold"
                      fontSize="xs"
                      opacity={.75}
                    >
                      {t("More")}
                      <FaChevronRight size="10px" />
                    </Flex>
                  </Flex>
                </Flex>
                <Box px={{ base: 4, md: 5 }} py={{ base: 4, md: 5 }}>
                  {renderBigSmallGrid(gamesList.slice(0, 8), category.alias)}
                </Box>
              </Box>
            );
          })}
          <Info locale={locale} />
        </VStack>
      </Container>
      <Footer />
    </>
  );
}
